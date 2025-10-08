import { models } from '../models/index.js';

const activeSessions = {};

// Helper function to broadcast final results
const sendFinalResults = (io, joinCode) => {
    const session = activeSessions[joinCode];
    if (session && session.currentQuestionData && !session.currentQuestionData.resultsSent) {
        console.log(`Ending question for session: ${joinCode}`);
        clearTimeout(session.currentQuestionData.timerId); // Stop any active timer
        session.currentQuestionData.resultsSent = true;
        const payload = {
            results: session.liveResults,
            correctAnswerIndex: session.currentQuestionData.question.correctAnswerIndex,
        };
        io.to(joinCode).emit('session:finalResults', payload);
    }
};


const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on('teacher:createSession', ({ pollId, joinCode }) => {
      socket.join(joinCode);
      socket.joinCode = joinCode; 
      socket.userRole = 'teacher';

      activeSessions[joinCode] = {
        pollId,
        participants: [],
        teacherSocketId: socket.id,
        currentQuestionData: null,
        liveResults: {},
      };
      console.log(`👨‍🏫 Teacher created session: ${joinCode}`);
    });

    socket.on('student:joinSession', ({ joinCode, name }) => {
      const session = activeSessions[joinCode];
      if (session) {
        const nameExists = session.participants.some(p => p.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
          socket.emit('session:error', { message: `The name "${name}" is already taken.` });
          return;
        }
        socket.join(joinCode);
        socket.joinCode = joinCode;
        socket.userName = name;
        socket.userRole = 'student';
        const newParticipant = { id: socket.id, name };
        session.participants.push(newParticipant);
        io.to(joinCode).emit('session:updateParticipants', session.participants);
        console.log(`🎓 Student ${name} joined session: ${joinCode}`);
        socket.emit('session:joined', { success: true });
      } else {
        socket.emit('session:error', { message: 'Session not found.' });
      }
    });

    socket.on('teacher:askQuestion', async ({ joinCode, question }) => {
      const session = activeSessions[joinCode];
      if(session) {
        try {
          const poll = await models.Poll.findOne({ joinCode });
          if (poll) {
            poll.questions.push(question);
            await poll.save();

            session.liveResults = {};
            session.currentQuestionData = {
              question,
              votedStudents: new Set(),
              resultsSent: false,
            };

            const timerId = setTimeout(() => sendFinalResults(io, joinCode), question.timeLimit * 1000);
            session.currentQuestionData.timerId = timerId;
            
            io.to(joinCode).emit('student:newQuestion', question);
            console.log(`❓ Question asked in session: ${joinCode}`);
          }
        } catch (error) {
          console.error('Error saving question:', error);
        }
      }
    });

    socket.on('student:submitAnswer', ({ joinCode, studentName, answerIndex }) => {
      const session = activeSessions[joinCode];
      if (session && session.currentQuestionData && !session.currentQuestionData.votedStudents.has(studentName)) {
        session.liveResults[answerIndex] = (session.liveResults[answerIndex] || 0) + 1;
        io.to(session.teacherSocketId).emit('teacher:updateResults', session.liveResults);
        session.currentQuestionData.votedStudents.add(studentName);

        if (session.participants.length > 0 && session.currentQuestionData.votedStudents.size === session.participants.length) {
            sendFinalResults(io, joinCode);
        }
      }
    });

    socket.on('teacher:endQuestion', ({ joinCode }) => {
      sendFinalResults(io, joinCode);
    });
    
    socket.on('chat:sendMessage', ({ joinCode, message, sender }) => {
      io.to(joinCode).emit('chat:newMessage', { message, sender, timestamp: new Date() });
    });

    socket.on('disconnect', () => {
      console.log(`👋 Client disconnected: ${socket.id}`);
      const { joinCode, userRole, userName } = socket;
      if (joinCode && activeSessions[joinCode]) {
        const session = activeSessions[joinCode];
        if (userRole === 'student') {
          session.participants = session.participants.filter(p => p.id !== socket.id);
          io.to(joinCode).emit('session:updateParticipants', session.participants);
          if (session.currentQuestionData && !session.currentQuestionData.resultsSent && session.participants.length > 0 && session.currentQuestionData.votedStudents.size === session.participants.length) {
            sendFinalResults(io, joinCode);
          }
        }
        if (userRole === 'teacher') {
            io.to(joinCode).emit('session:error', { message: 'The teacher has ended the session.' });
            delete activeSessions[joinCode];
        }
      }
    });

    socket.on('teacher:kickParticipant', ({ joinCode, participantId }) => {
        const session = activeSessions[joinCode];
        // Ensure the person emitting this is the teacher of this session
        if (session && session.teacherSocketId === socket.id) {
            const targetSocket = io.sockets.sockets.get(participantId);
            if (targetSocket) {
                // Force the student's client to disconnect
                targetSocket.emit('session:error', { message: 'You have been removed from the session by the teacher.' });
                targetSocket.disconnect(true);
                console.log(`👨‍🏫 Teacher kicked student ${participantId} from session ${joinCode}`);
            }
        }
    });

  });
};

export default initializeSocket;


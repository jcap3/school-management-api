const jwt = require('jsonwebtoken');
const User = require('../managers/models/User');
const Classroom = require('../managers/models/Classroom');
const School = require('../managers/models/School');

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const authorize = async (req, res, next) => {
   
    try {
        
        const user = await User.findById(req.user._id);
        // re-assign user from jwt to db user
        req.user = user;
        console.log('user role:', user.role);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.role === 'superadmin') {
            return next();
        }

        const roles = {
            createClassroom: ['superadmin', 'schooladmin'],
            getClassroom: ['superadmin', 'schooladmin'],
            getClassrooms: ['superadmin', 'schooladmin'],
            updateClassroom: ['superadmin', 'schooladmin'],
            deleteClassroom: ['superadmin', 'schooladmin'],
            createStudent: ['superadmin', 'schooladmin'],
            getStudent: ['superadmin', 'schooladmin'],
            getStudents: ['superadmin', 'schooladmin'],
            getStudentsBySchool: ['superadmin', 'schooladmin'],
            updateStudent: ['superadmin', 'schooladmin'],
            deleteStudent: ['superadmin', 'schooladmin'],
            enrollStudent: ['superadmin', 'schooladmin'],
            createSchool: ['superadmin'],
            getSchool: ['superadmin'],
            getSchools: ['superadmin'], 
            updateSchool: ['superadmin'],
            deleteSchool: ['superadmin']
        };

        let fnName = req.params.fnName;
        
        if (!roles[fnName] || !roles[fnName].includes(user.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        if (user.role === 'schooladmin') {
             
            if (req.body.school) {
                if (user.school._id.toString() !== req.body.school.toString()) {
                    return res.status(403).json({ message: 'Access denied. You can only access resources within your assigned school.' });
                }
            } else if (req.body.id) {
                let entity = await Classroom.findById(req.body.id);
                
                // check if id is students
                if (!entity) {
                    entity = await Student.findById(req.body.id);
                }

                if (!entity) {
                    return res.status(403).json({ message: 'Access denied.' });
                }

                if (entity.school.toString() !== user.school.toString()) {
                    return res.status(403).json({ message: 'Access denied. You can only access resources within your assigned school.' });
                }
            }
        }

        next();
    } catch (ex) {
        console.log('ex:', ex);
        res.status(403).json({ message: 'Access denied.' });
    }
};

module.exports = { authenticate, authorize };
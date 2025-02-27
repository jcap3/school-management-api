const Student = require('../../models/Student');
const Classroom = require('../../models/Classroom');
const e = require('express');

module.exports = class StudentManager {
    constructor({ config, cache, cortex }) {
        this.config = config;
        this.cache = cache;
        this.cortex = cortex;
        this.httpExposed = [
            'post=createStudent', 
            'post=enrollStudent',
            'get=getStudent', 
            'get=getStudents',
            'put=updateStudent',
            'post=enrollStudent',
            'delete=deleteStudent'];
    }

    async createStudent(data) {
        try {
            const student = new Student(data);
            await student.save();
            return { success: true, student };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStudents(data) {
        try {
            let students;
            if (data.req.user.role === 'superadmin') {
                students = await Student.find();
            } else {
                students = await Student.find({ school: data.req.user.school });
            }
            return { success: true, students };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStudent({id}) {
        try {
            const student = await Student.findById(id);
            if (!student) {
                throw new Error('Student not found');
            }
            return { success: true, student };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async enrollStudent({ id, classroomId }) {
        try {
            const student = await Student.findById(id);
            if (!student) {
                throw new Error('Student not found');
            }

            if (student.classroom) {
                throw new Error('Student is already enrolled in a classroom');
            }

            const classroom = await Classroom.findById(classroomId);
            if (!classroom) {
                throw new Error('Classroom not found');
            } 
            
            const studentCount = await Student.countDocuments({ classroom: classroomId });
            if (studentCount >= classroom.capacity) {
                throw new Error('Classroom is full');
            }

            student.classroom = classroomId;
            await student.save();
            return { success: true, student };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateStudent({id, name, age, program, school}) {
        try {
            const studentUpdatedFields = { id, name, age, program, school };
            const student = await Student.findByIdAndUpdate(id, studentUpdatedFields, { new: true });
            if (!student) {
                throw new Error('Student not found');
            }
            return { success: true, student };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteStudent({id}) {
        try {
            const student = await Student.findByIdAndDelete(id);
            if (!student) {
                throw new Error('Student not found');
            }
            return { success: true, message: 'Student deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
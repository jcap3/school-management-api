const Classroom = require('../../models/Classroom');

module.exports = class ClassroomManager {
    constructor({ config, cache, cortex }) {
        this.config = config;
        this.cache = cache;
        this.cortex = cortex;
        this.httpExposed = ['post=createClassroom', 'get=getClassroom', 'get=getClassrooms', 'put=updateClassroom', 'delete=deleteClassroom'];
    }

    async createClassroom(data) {
        try {
            const classroom = new Classroom(data);
            await classroom.save();
            return { success: true, classroom };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getClassrooms({ school }) {
        try {
            const classrooms = await Classroom.findOne({ school: school });
            if (!classrooms) {
                throw new Error('Classrooms not found');
            }
            return { success: true, classrooms };       
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getClassroom({id}) {
        try {
            const classroom = await Classroom.findById(id);
            if (!classroom) {
                throw new Error('Classroom not found');
            }
            return { success: true, classroom };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateClassroom({id, name, capacity, school}) {
        try {
            const updatedClassromFields = { id, name, capacity, school };
            const classroom = await Classroom.findByIdAndUpdate(id, updatedClassromFields, { new: true });
            if (!classroom) {
                throw new Error('Classroom not found');
            }
            return { success: true, classroom };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteClassroom({id}) {
        try {
            const classroom = await Classroom.findByIdAndDelete(id);
            if (!classroom) {
                throw new Error('Classroom not found');
            }
            return { success: true, message: 'Classroom deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
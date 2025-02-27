const School = require('../../models/School');

module.exports = class SchoolManager {
    constructor({ config, cache, cortex }) {
        this.config = config;
        this.cache = cache;
        this.cortex = cortex;
        this.httpExposed = ['post=createSchool', 'get=getSchools', 'get=getSchool', 'put=updateSchool', 'delete=deleteSchool'];
    }

    async createSchool(data) {
        try {
            const school = new School(data);
            await school.save();
            return { success: true, school };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getSchool({ id }) {
        try {
            const school = await School.findById(id);
            if (!school) {
                throw new Error('School not found');
            }
            return { success: true, school };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getSchools() {
        try {
            const schools = await School.find();
            return { success: true, schools };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }   

    async updateSchool({ id, name, address, phone, email, website, principal, established }) {
        try {
            const updatedSchoolFields = { id, name, address, phone, email, website, principal, established };
            const school = await School.findByIdAndUpdate(id, updatedSchoolFields, { new: true });
            if (!school) {
                throw new Error('School not found');
            }
            return { success: true, school };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteSchool({id}) {
        try {
            const school = await School.findByIdAndDelete(id);
            if (!school) {
                throw new Error('School not found');
            }
            return { success: true, message: 'School deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
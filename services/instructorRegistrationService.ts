import api from './api';

export interface InstructorRegistrationData {
  name: string;
  qualification: string;
  subject: string;
  phone: string;
}

export const instructorRegistrationService = {
  registerInstructor: async (data: InstructorRegistrationData) => {
    const response = await api.post('/instructor-registrations', data);
    return response.data;
  },
};

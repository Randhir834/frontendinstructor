import api from './api';

export interface InstructorRegistrationData {
  name: string;
  qualification: string;
  subject: string;
  phone: string;
}

export const instructorRegistrationService = {
  registerInstructor: async (data: InstructorRegistrationData) => {
    // Map frontend field names to backend field names
    const backendData = {
      fullName: data.name,
      qualification: data.qualification,
      subjectExpertise: data.subject,
      phoneNumber: data.phone,
      role: 'instructor'
    };
    const response = await api.post('/instructor-registrations', backendData);
    return response.data;
  },
};

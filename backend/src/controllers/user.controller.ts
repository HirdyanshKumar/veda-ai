import { Request, Response } from 'express';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

export const onboardUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const { role, school, location, subject } = req.body;

    if (!role || role !== 'teacher') {
      res.status(400).json({
        success: false,
        message: "Invalid role. Only 'teacher' is supported."
      });
      return;
    }

    const cleanSchool = typeof school === 'string' ? school.trim().slice(0, 100) : '';
    const cleanLocation = typeof location === 'string' ? location.trim().slice(0, 100) : '';
    const cleanSubject = typeof subject === 'string' ? subject.trim().slice(0, 50) : '';

    await clerkClient.users.updateUserMetadata(userId!, {
      publicMetadata: {
        onboarded: true,
        role: 'teacher',
        school: cleanSchool,
        location: cleanLocation,
        subject: cleanSubject,
        onboardedAt: new Date().toISOString()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Onboarding complete',
      data: {
        role: 'teacher',
        school: cleanSchool,
        location: cleanLocation,
        subject: cleanSubject
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

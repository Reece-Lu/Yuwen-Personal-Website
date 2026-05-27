import { get, post, del, uploadFile } from '../utils/api-utils';

// Fetch all notes
export const fetchAllNotes = async () => {
    try {
        const data = await get('/note', {}, 'springBoot'); // 'springBoot' for Spring Boot
        return data;
    } catch (error) {
        console.error('Error fetching all notes:', error);
        throw error;
    }
};

// Fetch note by ID
export const fetchNoteById = async (id) => {
    try {
        const data = await get(`/note/${id}`, {}, 'springBoot'); // 'springBoot' for Spring Boot
        return data;
    } catch (error) {
        console.error(`Error fetching note with ID ${id}:`, error);
        throw error;
    }
};

// Create a new note
export const createNote = async (noteData) => {
    try {
        const data = await post('/note', noteData, 'springBoot'); // 'springBoot' for Spring Boot
        return data;
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
};

// Upload a note with file
export const uploadNote = async (noteData, file) => {
    try {
        const data = await uploadFile('/note/upload', file, noteData, 'springBoot'); // 'springBoot' for Spring Boot
        return data;
    } catch (error) {
        console.error('Error uploading note:', error);
        throw error;
    }
};

// Delete note by ID
export const deleteNoteById = async (id) => {
    try {
        const data = await del(`/note/${id}`, 'springBoot'); // 'springBoot' for Spring Boot
        return data;
    } catch (error) {
        console.error(`Error deleting note with ID ${id}:`, error);
        throw error;
    }
};

// Get note image by filename — relative path, served via nginx → personal-data-service
export const getNoteImage = (filename) => {
    return `/springapp/note/image/${filename}`;
};

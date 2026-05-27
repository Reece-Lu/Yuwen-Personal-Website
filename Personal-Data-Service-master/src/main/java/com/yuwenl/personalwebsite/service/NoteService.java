package com.yuwenl.personalwebsite.service;

import com.yuwenl.personalwebsite.entity.Note;
import com.yuwenl.personalwebsite.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Value("${app.file.storage-location}")
    private String storageLocation;

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(Integer id) {
        return noteRepository.findById(id);
    }

    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }

    public void deleteNoteById(Integer id) {
        noteRepository.deleteById(id);
    }

    public String storeFile(MultipartFile file) throws Exception {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path storagePath = Paths.get(storageLocation, filename);
        Files.copy(file.getInputStream(), storagePath);
        return filename;
    }

    public Path loadFileAsResource(String filename) {
        return Paths.get(storageLocation).resolve(filename).normalize();
    }
}

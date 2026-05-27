package com.yuwenl.personalwebsite.controller;

import com.yuwenl.personalwebsite.entity.Note;
import com.yuwenl.personalwebsite.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/note")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Value("${app.file.storage-location}")
    private String storageLocation;

    @GetMapping
    public List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Integer id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return noteService.saveNote(note);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNoteById(@PathVariable Integer id) {
        noteService.deleteNoteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<Note> uploadNote(@RequestParam("file") MultipartFile file, @RequestParam("notename") String notename, @RequestParam("noteurl") String noteurl) {
        try {
            String filename = noteService.storeFile(file);
            Note note = new Note();
            note.setNotename(notename);
            note.setNoteurl(noteurl);
            note.setNotecovername(filename);
            return ResponseEntity.ok(noteService.saveNote(note));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = noteService.loadFileAsResource(filename);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

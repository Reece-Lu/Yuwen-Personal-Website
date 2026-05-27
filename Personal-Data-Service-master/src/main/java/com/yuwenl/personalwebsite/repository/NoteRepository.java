package com.yuwenl.personalwebsite.repository;

import com.yuwenl.personalwebsite.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Integer> {
}

package com.academy.sports.controller;

import com.academy.sports.model.Athlete;
import com.academy.sports.repository.AthleteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AthleteController {
    private final AthleteRepository repository;
    public AthleteController(AthleteRepository repository) { this.repository = repository; }

    @GetMapping("/athletes")
    public List<Athlete> all() { return repository.findAll(); }

    @PostMapping("/athletes")
    @ResponseStatus(HttpStatus.CREATED)
    public Athlete create(@RequestBody Athlete athlete) {
        athlete.setId(null);
        return repository.save(athlete);
    }

    @PutMapping("/athletes/{id}")
    public Athlete update(@PathVariable Long id, @RequestBody Athlete data) {
        Athlete athlete = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Athlete not found"));
        athlete.setFullName(data.getFullName());
        athlete.setAge(data.getAge());
        athlete.setSport(data.getSport());
        athlete.setPhone(data.getPhone());
        athlete.setEmail(data.getEmail());
        athlete.setStatus(data.getStatus());
        return repository.save(athlete);
    }

    @DeleteMapping("/athletes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Athlete not found");
        repository.deleteById(id);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return Map.of("totalAthletes", repository.count(),
                      "activeAthletes", repository.countByStatus("Active"),
                      "sportsOffered", repository.findAll().stream().map(Athlete::getSport).filter(s -> s != null && !s.isBlank()).distinct().count());
    }
}

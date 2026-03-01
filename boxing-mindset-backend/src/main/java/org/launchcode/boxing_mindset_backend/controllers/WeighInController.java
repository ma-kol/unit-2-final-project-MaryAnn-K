package org.launchcode.boxing_mindset_backend.controllers;

import org.launchcode.boxing_mindset_backend.dto.WeighInDTO;
import org.launchcode.boxing_mindset_backend.models.User;
import org.launchcode.boxing_mindset_backend.models.WeighIn;
import org.launchcode.boxing_mindset_backend.repositories.UserRepository;
import org.launchcode.boxing_mindset_backend.repositories.WeighInRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/weigh-ins")
public class WeighInController {
    @Autowired
    WeighInRepository weighInRepository;
    @Autowired
    UserRepository userRepository;

    @GetMapping("")
    public List<WeighIn> getAllWeighIns() {
        return weighInRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<WeighIn> getWeighInsForUser(@PathVariable int userId) {
        return weighInRepository.findByUser_IdOrderByDateDesc(userId);
    }

    @GetMapping("/latest/{userId}")
    public WeighIn getLatestWeighInForUser(@PathVariable int userId) {
        return weighInRepository.findTopByUser_IdOrderByDateDesc(userId).orElse(null);
    }

    @PostMapping("/add")
    public String addWeighIn(@RequestBody WeighInDTO body) {
        {
            User user = userRepository.findById(body.userId).orElse(null);
            if (user == null) {
                throw new IllegalArgumentException("User with ID " + body.userId + " not found.");
            }
            WeighIn newWeighIn = new WeighIn();
            newWeighIn.setUser(user);
            newWeighIn.setDate(body.date);
            newWeighIn.setWeight(body.weight);
            newWeighIn.setNotes(body.notes);
            weighInRepository.save(newWeighIn);
            return "New weight of " + newWeighIn + " added and recorded successfully.";
        }
    }
}

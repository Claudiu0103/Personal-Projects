package backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendBanEmail(String to, String username) {
        if (to == null || to.isBlank()) {
            throw new IllegalStateException("Emailul destinatarului nu este setat!");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Cont blocat");
        message.setText("Salut " + username + ", contul tău a fost banat de către un administrator.");
        message.setFrom("clod01032003@yahoo.com");

        mailSender.send(message);
    }

    public void sendUnbanEmail(String to, String username) {
        if (to == null || to.isBlank()) {
            throw new IllegalStateException("Emailul destinatarului nu este setat!");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Cont deblocat");
        message.setText("Salut " + username + ", contul tău a fost deblocat și poți folosi din nou platforma.");
        message.setFrom("clod01032003@yahoo.com");

        mailSender.send(message);
    }

}


package com.unla.deporteonline.controllers.api.v1;

import java.util.Date;
import java.util.List;

import java.util.stream.Collectors;

import com.unla.deporteonline.entities.User;
import com.unla.deporteonline.services.IUserService;
import com.unla.deporteonline.exception.ValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@CrossOrigin("*")
@RequestMapping("/user")
public class UserRestController {

	@Autowired
	@Qualifier("userService")
	private IUserService userService;

	
	@GetMapping("/login")
    public String login(@RequestParam("email") String email, @RequestParam("password") String password) {
		User user = userService.findByEmailAndPassword(email, password);
			if(user == null) throw new ValidationException("Usuario no valido");
		user.setIslogged(true);
		userService.saveUser(user);
        return getJWTToken(user.getEmail());
	}
	
////////////////////*******************USER ********************************/////////////////////

	//modificar usuario
	@PostMapping(value ="/updateUser", consumes="application/json")
    public Object updateUser(@RequestBody User updateUser) {
		System.out.println("User: " + updateUser.toString());
		return userService.saveUser(updateUser);
	}
	//eliminar usuario logicamente
	@PostMapping(value ="/deleteUser")
	public String deleteUser(@RequestParam("email") String email, @RequestParam("password") String password) {
		User user = userService.findByEmailAndPassword(email, password);
			if(user == null) throw new ValidationException("Usuario no valido");
		user.setIslogged(false);
		user.setEnabled(false);
		userService.saveUser(user);
		return ("usuario eliminado");
	}

	//eliminar usuario fisico
	@DeleteMapping(value="/deleteUser")
	public String deleteUserPhysical(@RequestParam("email") String email, @RequestParam("password") String password){
		User user = userService.findByEmailAndPassword(email, password);
			if(user == null) throw new ValidationException("Usuario no valido");
		userService.deleteUser(user);
		return ("usuario eliminado");
	}
	
	//agregar usuario
	@PostMapping(value ="/newUser", consumes="application/json")
    public Object newUser(@RequestBody User newUser) {
		newUser.setEnabled(true);
		System.out.println("User: " + newUser.toString());
		return userService.saveUser(newUser);

	}

    private String getJWTToken(String username) {
		String secretKey = "mySecretKey";
		List<GrantedAuthority> grantedAuthorities = AuthorityUtils
				.commaSeparatedStringToAuthorityList("ROLE_USER");
		
		String token = Jwts
				.builder()
				.setId("softtekJWT")
				.setSubject(username)
				.claim("authorities",
						grantedAuthorities.stream()
								.map(GrantedAuthority::getAuthority)
								.collect(Collectors.toList()))
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 600000))
				.signWith(SignatureAlgorithm.HS512,
						secretKey.getBytes()).compact();

		return "Bearer " + token;
	}

	@GetMapping("/allusers")
	public List<User> findAll() {
		return userService.findAll();
	}

}
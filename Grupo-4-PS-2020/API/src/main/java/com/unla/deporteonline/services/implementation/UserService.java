package com.unla.deporteonline.services.implementation;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.unla.deporteonline.entities.Role;
import com.unla.deporteonline.repositories.IUserRepository;
import com.unla.deporteonline.services.IUserService;

@Service("userService")
public class UserService implements UserDetailsService, IUserService {

	@Autowired
	@Qualifier("userRepository")
	private IUserRepository userRepository;

	public List<com.unla.deporteonline.entities.User> findAll() {
		return userRepository.findAll();
	}
	
	public com.unla.deporteonline.entities.User findById(int id) {
		return userRepository.findById(id);
	}

	public com.unla.deporteonline.entities.User findByEmailAndPassword(String email, String password) {
		return userRepository.findByEmailAndPassword(email, password);
	}

	public com.unla.deporteonline.entities.User findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public Object saveUser(com.unla.deporteonline.entities.User user) {

		//Falta excepcion email
		return userRepository.saveAndFlush(user);
	}

	public void deleteUser(com.unla.deporteonline.entities.User user) {
		userRepository.delete(user);
	}

	public com.unla.deporteonline.entities.User findUserById(final int id) {
		return userRepository.findById(id);//.get();
	}

	public List<com.unla.deporteonline.entities.User> findByIsEnabled() {
		return userRepository.findByIsEnabled();
	}

	public Optional<com.unla.deporteonline.entities.User> findById(long id) {
		return userRepository.findById(id);
	}
	
	@Override
	//Toma el email
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		com.unla.deporteonline.entities.User user = userRepository.findByEmailAndFetchUserRolesEagerly(email);
		return buildUser(user, buildGrantedAuthorities(user.getRoles()));
	}
	
	private User buildUser(com.unla.deporteonline.entities.User user, List<GrantedAuthority> grantedAuthorities) {
        return new User(user.getEmail(), user.getPassword(), user.getEnabled(),
						true, true, true, //accountNonExpired, credentialsNonExpired, accountNonLocked,
						grantedAuthorities);
	}
	
	private List<GrantedAuthority> buildGrantedAuthorities(Set<Role> roles) {
		Set<GrantedAuthority> grantedAuthorities = new HashSet<GrantedAuthority>();
		for(Role role: roles) {
			grantedAuthorities.add(new SimpleGrantedAuthority(role.getName()));
		}
		return new ArrayList<GrantedAuthority>(grantedAuthorities);
	}
}
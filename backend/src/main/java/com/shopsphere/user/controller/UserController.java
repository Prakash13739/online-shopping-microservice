package com.shopsphere.user.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.user.entity.Address;
import com.shopsphere.user.entity.UserProfile;
import com.shopsphere.user.repository.AddressRepository;
import com.shopsphere.user.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private AddressRepository addressRepository;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfile>> getUserById(@PathVariable(value = "id") Long id) {
        return userProfileRepository.findByAuthUserId(id)
                .map(u -> ResponseEntity.ok(ApiResponse.success("User profile found", u)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found", "USER_NOT_FOUND")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfile>> updateUser(@PathVariable(value = "id") Long id,
                                                               @RequestBody Map<String, String> updates) {
        Optional<UserProfile> opt = userProfileRepository.findByAuthUserId(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found", "USER_NOT_FOUND"));
        }
        UserProfile profile = opt.get();
        if (updates.containsKey("name")) profile.setName(updates.get("name"));
        if (updates.containsKey("phone")) profile.setPhone(updates.get("phone"));
        if (updates.containsKey("bio")) profile.setBio(updates.get("bio"));
        if (updates.containsKey("avatarUrl")) profile.setAvatarUrl(updates.get("avatarUrl"));
        UserProfile saved = userProfileRepository.save(profile);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", saved));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserProfile>> createOrUpdateProfile(@RequestBody Map<String, Object> body) {
        Long authUserId = Long.parseLong(body.get("authUserId").toString());
        Optional<UserProfile> existing = userProfileRepository.findByAuthUserId(authUserId);
        UserProfile profile = existing.orElse(new UserProfile());
        profile.setAuthUserId(authUserId);
        if (body.containsKey("name")) profile.setName(body.get("name").toString());
        if (body.containsKey("email")) profile.setEmail(body.get("email").toString());
        if (body.containsKey("phone")) profile.setPhone(body.get("phone") != null ? body.get("phone").toString() : null);
        UserProfile saved = userProfileRepository.save(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Profile created/updated", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserProfile>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("All users", userProfileRepository.findAll()));
    }

    @GetMapping("/{id}/addresses")
    public ResponseEntity<ApiResponse<List<Address>>> getAddresses(@PathVariable(value = "id") Long id) {
        Optional<UserProfile> profile = userProfileRepository.findByAuthUserId(id);
        Long profileId = profile.map(UserProfile::getId).orElse(id);
        List<Address> addresses = addressRepository.findByUserId(profileId);
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved", addresses));
    }

    @PostMapping("/{id}/addresses")
    public ResponseEntity<ApiResponse<Address>> addAddress(@PathVariable(value = "id") Long id,
                                                            @RequestBody Address address) {
        Optional<UserProfile> profile = userProfileRepository.findByAuthUserId(id);
        Long profileId = profile.map(UserProfile::getId).orElse(id);
        address.setUserId(profileId);
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefaultTrue(profileId)
                    .ifPresent(existing -> { existing.setIsDefault(false); addressRepository.save(existing); });
        }
        Address saved = addressRepository.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Address added", saved));
    }

    @PutMapping("/{id}/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Address>> updateAddress(@PathVariable(value = "id") Long id,
                                                               @PathVariable(value = "addressId") Long addressId,
                                                               @RequestBody Address updated) {
        Optional<UserProfile> profile = userProfileRepository.findByAuthUserId(id);
        Long profileId = profile.map(UserProfile::getId).orElse(id);
        Optional<Address> existing = addressRepository.findByIdAndUserId(addressId, profileId);
        if (existing.isEmpty()) return ResponseEntity.status(404).body(ApiResponse.error("Address not found", "ADDRESS_NOT_FOUND"));
        Address addr = existing.get();
        if (updated.getFullName() != null) addr.setFullName(updated.getFullName());
        if (updated.getPhone() != null) addr.setPhone(updated.getPhone());
        if (updated.getStreet() != null) addr.setStreet(updated.getStreet());
        if (updated.getLandmark() != null) addr.setLandmark(updated.getLandmark());
        if (updated.getCity() != null) addr.setCity(updated.getCity());
        if (updated.getDistrict() != null) addr.setDistrict(updated.getDistrict());
        if (updated.getState() != null) addr.setState(updated.getState());
        if (updated.getPostalCode() != null) addr.setPostalCode(updated.getPostalCode());
        if (updated.getCountry() != null) addr.setCountry(updated.getCountry());
        if (updated.getAddressType() != null) addr.setAddressType(updated.getAddressType());
        if (updated.getIsDefault() != null) {
            if (Boolean.TRUE.equals(updated.getIsDefault())) {
                addressRepository.findByUserIdAndIsDefaultTrue(profileId)
                        .ifPresent(def -> { def.setIsDefault(false); addressRepository.save(def); });
            }
            addr.setIsDefault(updated.getIsDefault());
        }
        return ResponseEntity.ok(ApiResponse.success("Address updated", addressRepository.save(addr)));
    }

    @DeleteMapping("/{id}/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable(value = "id") Long id,
                                                            @PathVariable(value = "addressId") Long addressId) {
        Optional<UserProfile> profile = userProfileRepository.findByAuthUserId(id);
        Long profileId = profile.map(UserProfile::getId).orElse(id);
        Optional<Address> addr = addressRepository.findByIdAndUserId(addressId, profileId);
        if (addr.isEmpty()) return ResponseEntity.status(404).body(ApiResponse.error("Address not found", "ADDRESS_NOT_FOUND"));
        addressRepository.delete(addr.get());
        return ResponseEntity.ok(ApiResponse.success("Address deleted", null));
    }
}

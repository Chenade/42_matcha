package middleware

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	utils "api/utils"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			// Example: Check for an auth token in headers (you can implement your logic)
			token := r.Header.Get("Authorization")
			if token == "" {
				http.Error(w, "Forbidden", http.StatusForbidden)
				return
			}

			// Validate the token (implement your logic here)
			// if invalidToken(token) {
			//     http.Error(w, "Unauthorized", http.StatusUnauthorized)
			//     return
			// }

			parts := strings.Split(token, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "Invalid Authorization format", http.StatusUnauthorized)
				return
			}

			userId, err := strconv.Atoi(parts[1])
			if err != nil {
				http.Error(w, "Invalid token", http.StatusUnauthorized)
				return
			}

			r.Header.Set("usrId", strconv.Itoa(userId))

			next.ServeHTTP(w, r)
		})
}

func AuthenticateMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			tokenString := r.Header.Get("Authorization")
			if tokenString == "" {
				log.Println("No token provided")
				http.Error(w, "Forbidden", http.StatusForbidden)
				return
			}

			claims, err := utils.VerifyToken(tokenString)
			if err != nil {
				log.Println("Error verifying token:", err)
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			log.Println("Token verified successfully. Claims: ", claims)
			r = r.WithContext(utils.SetJWTClaimsContext(r.Context(), claims))
			// fmt.Println("Claims set in context", r.Context().Value("claims"))
			// fmt.Println("claimsKey set in context", r.Context().Value(utils.ClaimsKey))

			// for key, val := range claims {
			// 	fmt.Printf("Key: %v, value: %v\n", key, val)
			// }

			// fmt.Println("User ID:", claims["user_id"])
			user_id_string := fmt.Sprintf("%v", claims["user_id"])
			// fmt.Println("User ID:", user_id_string)

			// TODO remove this and read user_id from context
			r.Header.Set("usrId", user_id_string)
			next.ServeHTTP(w, r)
		})
}

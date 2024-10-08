package middleware

import (
	"net/http"
	"strconv"
	"strings"
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
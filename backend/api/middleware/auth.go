package middleware

import (
	"net/http"
)

func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

		r.Header.Set("usrId", "1")
        next.ServeHTTP(w, r)
    })
}
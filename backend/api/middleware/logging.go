package middleware

import (
	"fmt"
	"net/http"
)

func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logRequest(r)
		rl := &ResponseLogger{ResponseWriter: w}
		next.ServeHTTP(rl, r)
		// logResponse(r, rl.status)
	})
}

type ResponseLogger struct {
	http.ResponseWriter
	status int
}

func (rl *ResponseLogger) WriteHeader(code int) {
	rl.status = code
	rl.ResponseWriter.WriteHeader(code)
}

func logRequest(r *http.Request) {
	body := ""
	if r.Method == "POST" || r.Method == "PUT" {
		r.ParseForm()
		body = " | body: " + r.Form.Encode()
	}
	fmt.Printf("Received %s request for %s%s\n", r.Method, r.URL.Path, body)
}

func logResponse(r *http.Request, status int) {
	fmt.Printf("Sent response for %s %s: %d\n", r.Method, r.URL.Path, status)
}

package middleware

import (
	"net/http"
	"strconv"

	"github.com/rs/zerolog/log"
)

type LoggingMiddleware struct{}

func NewLoggingMiddleware() *LoggingMiddleware {
	return &LoggingMiddleware{}
}

// responseRecorder catches response status and lenght,
// implements http.ResponseWriter
type responseRecorder struct {
	rw       http.ResponseWriter
	Code     int
	Len      int
	Response []byte
}

func newResponseRecorder(w http.ResponseWriter) *responseRecorder {
	return &responseRecorder{w, http.StatusOK, 0, []byte{}}
}

func (recorder *responseRecorder) Header() http.Header {
	return recorder.rw.Header()
}

func (recorder *responseRecorder) Write(bytes []byte) (int, error) {
	recorder.Len += len(bytes)
	recorder.Response = bytes
	return recorder.rw.Write(bytes)
}

func (recorder *responseRecorder) WriteHeader(statusCode int) {
	recorder.Code = statusCode
	recorder.rw.WriteHeader(statusCode)
}

// WithHTTPLogging adds logging to http handler
func (a *LoggingMiddleware) WithHTTPLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Pre handlers
		rw := newResponseRecorder(w)
		log.Debug().
			Str("method", r.Method).
			Str("url", r.URL.String()).
			Msg("")

		// Call handlers
		next.ServeHTTP(rw, r)

		// Post handlers
		if isError(rw.Code) {
			log.Error().
				Str("url", r.URL.String()).
				Str("responseCode", strconv.Itoa(rw.Code)).
				RawJSON("response", rw.Response).
				Msg("")
		}
	})
}

func isError(responseCode int) bool {
	return responseCode > 399
}

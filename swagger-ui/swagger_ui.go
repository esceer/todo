package swaggerui

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed dist
var swagfs embed.FS

// Handler returns a handler that will serve a self-hosted Swagger UI with given spec
func Handler(spec []byte) http.Handler {
	// render the index template with the proper spec name inserted
	static, _ := fs.Sub(swagfs, "dist")
	mux := http.NewServeMux()
	mux.HandleFunc("/swagger_spec", byteHandler(spec))
	mux.Handle("/", http.FileServer(http.FS(static)))
	return mux
}

func byteHandler(b []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) {
		w.Write(b)
	}
}

## Update Swagger UI
Download the latest Swagger UI dist from the official [GitHub Releases page](https://github.com/swagger-api/swagger-ui/releases/latest). Copy and overwrite the `dist` folder in `swagger-ui` module. Replace the `url` inside the `swagger-initializer.js` file by `./swagger_spec`.

## Usage
```go
//go:embed api.yaml
var apiSpec []byte

func main() {
	http.Handle("/swagger-ui/", http.StripPrefix("/swagger-ui", swaggerui.Handler(apiSpec)))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

## Reference
https://medium.com/@ribice/serve-swaggerui-within-your-golang-application-5486748a5ed4

https://github.com/flowchartsman/swaggerui
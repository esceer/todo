package apispec

import _ "embed"

//go:embed spec/api.yaml
var ApiSpec []byte

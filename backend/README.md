## Todo backend
A private deployable password and secret store. It is meant to be showcase the backend of a minimal full stack demo project.

## Usage
Run the application by calling `make run` in backend's root directory.

### Database
The application automatically creates and migrates a `sqlite` database in the application root directory. In order to reset, simply delete the `todo.db` file and restart the application.

## Swagger
The project contains the api description inside `api/spec/api.yaml` directory. Once the application is running, swagger-ui can also be accessed in a browser via `/swagger-ui/`.
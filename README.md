# todo
Sample full stack `Todo` app with vanilla javascript and a simple go crud backend. The focus of this application was to practice the basics before moving on to more complex javascript framework.

## UI

![image](https://github.com/esceer/todo/assets/33330748/affaba89-b6ba-4a70-9647-478a328bde2a)

## Setup
After cloning the repository, run the following commands in the root directory of this repository:
- `docker build -t todo .`
- `docker run -p 8888:80 -p 8081:8081 -t todo`

Feel free to alter any of the parameters.

Once started, the website can be reached at the specified port (in this case `8888`) - e.g. `http://localhost:8888/`

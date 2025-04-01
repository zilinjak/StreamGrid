# StreamGrid

## Developer Setup

### Local development


#### Frontend
```
cd app/frontend
npm install
npm run dev
```

#### Backend
```
cd app/backend
go run main.go
```

### Docker build

```
docker build -t streamgrid .
```

### Docker run

```
docker run --rm -it -p 8081:8081 streamgrid
```

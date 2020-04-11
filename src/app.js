const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

app.use(cors());

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: "Repo doesn't exist"})
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(repo);
  return response.status(200).json(repo)
});

app.put("/repositories/:id",validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(project => project.id === id)

  const likes = repositories[repoIndex].likes

  if (repoIndex < 0) {
    return response.status(400).json({error: "Repository not found."})
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes: likes
  }

  repositories[repoIndex] = repo
  if (repo.likes != repositories[repoIndex]["likes"]) {
    return response.status(400).json({error: "Can't update likes."})
  }
  return response.status(200).json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(project => project.id === id)

  if ( repoIndex < 0) {
    return response.status(400).json({error: "Repository not found."})
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).json(repositories)

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(project => project.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({error: "Repository not found."})
  }
  repositories[repoIndex]["likes"] = repositories[repoIndex]["likes"] + 1
  
  return response.status(200).json(repositories[repoIndex])
});

module.exports = app;

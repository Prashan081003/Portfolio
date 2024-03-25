import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import { Jumbotron } from "./migration";
import Row from "react-bootstrap/Row";
import ProjectCard from "./ProjectCard";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { PaginationControl } from "react-bootstrap-pagination-control";

const dummyProject = {
  name: null,
  description: null,
  svn_url: null,
  stargazers_count: null,
  languages_url: null,
  pushed_at: null,
};
const API = "https://api.github.com";
// const gitHubQuery = "/repos?sort=updated&direction=desc";
// const specficQuerry = "https://api.github.com/repos/hashirshoaeb/";

const Project = ({ heading, username, length, specfic }) => {
  const allReposAPI = `${API}/users/${username}/repos?sort=updated&direction=desc`;
  const specficReposAPI = `${API}/repos/${username}`;
  const dummyProjectsArr = new Array(length + specfic.length).fill(
    dummyProject
  );

  const [projectsArray, setProjectsArray] = useState([]);
  const [page, setPage] = useState(1);

  console.log({ page });
  const fetchRepos = useCallback(async () => {
    let repoList = [];
    try {
      // getting all repos
      const response = await axios.get(allReposAPI, {
        headers: { Authorization: "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" },
        params: {
          per_page: "6",
          page: `${page}`,
        },
      });
      setPage(page)
      // slicing to the length
      repoList = [...response.data.slice(0, length)];
      const totalPages = repoList.length;
      console.log({ totalPages });
      // console.log({ repoList });

      // adding specified repos
      try {
        for (let repoName of specfic) {
          const response = await axios.get(`${specficReposAPI}/${repoName}`);
          repoList.push(response.data);
        }
      } catch (error) {
        console.error(error.message);
      }
      // setting projectArray
      // TODO: remove the duplication.
      setProjectsArray(repoList);
    } catch (error) {
      console.error(error.message);
    }
  }, [allReposAPI, length, specfic, specficReposAPI, page]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  console.log(projectsArray);

  function sortByUpdatedAt(array) {
    array.sort((a, b) => {
      const dateA = new Date(a.pushed_at);
      const dateB = new Date(b.pushed_at);
      return dateB - dateA;
    });
    return array;
  }

  return (
    <Jumbotron fluid id="projects" className="bg-light m-0">
      <Container className="">
        <h2 className="display-4 pb-5 text-center">{heading}</h2>
        <Row>
          {projectsArray.length
            ? sortByUpdatedAt(projectsArray).map((project, index) => (
                <ProjectCard
                  key={`project-card-${index}`}
                  id={`project-card-${index}`}
                  value={project}
                />
              ))
            : dummyProjectsArr.map((project, index) => (
                <ProjectCard
                  key={`dummy-${index}`}
                  id={`dummy-${index}`}
                  value={project}
                />
              ))}
        </Row>
        <PaginationControl
          page={page}
          total={10}
          limit={2}
          changePage={(page) => {
            setPage(page);

          }}
          ellipsis={2}
        />
      </Container>
    </Jumbotron>
  );
};

export default Project;

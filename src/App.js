import React, { useState, useCallback, useRef, useEffect } from "react";
import "./App.css";
import { FaRegWindowClose } from "react-icons/fa";

const delay = 200;
const repoURL = "http://www.omdbapi.com/?apikey=ada693f8&s=";

export default function App() {
  const wrapperRef = useRef(null);
  const [showList, setShowList] = useState(true);
  const [movieInput, setMovieInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMovieInput("");
        setShowList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  const onChange = async (query) => {
    try {
      setLoading(true);
      let response = await fetch(repoURL + query);
      let data = await response.json();
      if (data.Search) setMovies(data.Search);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  function removeRecent(i) {
    setSelectedMovie((prev) => prev.filter((name, index) => index !== i));
  }

  const debounceOnChange = useCallback(debounce(onChange, delay), []);

  return (
    <>
      <div className="header">
        <h1> JFL Engineering Take Home Project</h1>
      </div>
      <div className="mainPage">
        <div className="searchScreen">
          <div>
            <label>Search Movies : </label>
            <div className="selectedMovies">
              {selectedMovie.map((title, index) => {
                return (
                  <div key={"selectedmovie_" + index} className="selectedMovie">
                    <span>
                      {title}
                      <FaRegWindowClose onClick={() => removeRecent(index)} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <span>
              <input
                placeholder="Movie Title"
                value={movieInput}
                onChange={(e) => {
                  setMovieInput(e.target.value);
                  setShowList(true);
                  debounceOnChange(e.target.value);
                }}
                className={loading ? "loading inputField" : "inputField"}
              />
            </span>
            <List trendingmovies={movies} />
          </div>
        </div>
      </div>
    </>
  );

  function List({ trendingmovies }) {
    const onClick = (movieTitle) => {
      setSelectedMovie((prev) => {
        let movies = prev.filter((title, index) => prev.length - index <= 4);
        movies.push(movieTitle);
        return movies;
      });
    };
    return (
      showList && (
        <div
          style={{ maxHeight: "100px", overflowY: "scroll" }}
          ref={wrapperRef}
        >
          {trendingmovies.map((movie, id) => {
            return (
              <div key={id}>
                <button
                  style={{ width: "100%" }}
                  onClick={() => {
                    onClick(movie.Title);
                  }}
                >
                  {movie.Title}
                </button>
              </div>
            );
          })}
        </div>
      )
    );
  }
}

import { FormEvent, useState } from "react";
import { Loader, Placeholder, } from "@aws-amplify/ui-react";
import "./App.css";
import "./styles/buttons.scss";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";


Amplify.configure(outputs);
console.log("Amplify Config:", outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
})

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      formData.forEach((value, key) => {
        console.log(`key: ${key} \nvalue: ${value}`);
      });

      const response = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      console.log("Full Response:", response);

      if (response.errors) {
        console.error("GraphQL errors:", response.errors);
        setResult(`Error: ${response.errors}`);
      } else if (response.data?.body) {
        setResult(response.data.body);
      } else {
        console.log(response.errors);
        setResult("No recipe could be generated. Please try again.");
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      setResult(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="nav">
        <button className="signout">Sign Out</button>
      </div>
      <div className="app-container">
        <div className="header-container">
          <h1 className="main-header">
            Meet Your Personal
            <br />
            <span className="highlight">Smart Chef</span>
          </h1>
          <p className="description">
            Simply type a few ingredients using the format ingredient1,
            ingredient2, etc., and Recipe AI will generate an all-new recipe on
            demand...
          </p>
        </div>
        <form onSubmit={onSubmit} className="form-container">
          <div className="search-container">
            <input
              type="text"
              className="wide-input"
              id="ingredients"
              name="ingredients"
              placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
            />
            <button type="submit" className="search-button generate">Generate recipe</button>
            
          </div>
        </form>
        <div className="result-container">
          {loading ? (
            <div className="loader-container">
              <p>Loading...</p>
              <Loader size="large" />
              <Placeholder size="large" />
              <Placeholder size="large" />
              <Placeholder size="large" />
            </div>
          ) : (
            result && <p className="result">{result}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App

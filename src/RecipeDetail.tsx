import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { parseString } from 'xml2js'; // Ensure xml2js is installed and imported

function RecipeDetail() {
  let { recipeName } = useParams();
  const [recipeType, setRecipeType] = useState('');
  const [recipeSteps, setRecipeSteps] = useState([]);

  useEffect(() => {
    const gexfFilePath = '/steps_test.gexf';

    fetch(gexfFilePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch GEXF file');
        }
        return response.text();
      })
      .then(gexfContent => {
        parseGexf(gexfContent);
      })
      .catch(error => {
        console.error('Error fetching GEXF file:', error);
      });
  }, [recipeName]);

  function parseGexf(gexfXml) {
    parseString(gexfXml, (err, result) => {
      // console.log(gexfXml)
      if (err) {
        console.error("Error parsing GEXF:", err);
        return;
      }
      const nodes = result.gexf.graph[0].nodes[0].node;
      const recipeInfo = nodes.find(node => node.$.label.toLowerCase() === recipeName.toLowerCase());
      console.log(recipeInfo)

      if (recipeInfo) {
        recipeInfo.attvalues[0].attvalue.forEach(att => {
          console.log(att);

          if (att.$.for === "2") {
            setRecipeType(att.$.value);
          } else if (att.$.for === "3") {
            try {
              // Since the steps might be stored as a string that resembles a JSON array
              const steps = JSON.parse(att.$.value.replace(/'/g, '"'));
              console.log(steps);
              setRecipeSteps(steps);
            } catch (error) {
              console.error("Error parsing recipe steps:", error);
            }
          }
        });
      }
    });
  }

  return (
    <div>
      <h2>Recipe Detail for: {recipeName}</h2>
      {recipeType && <p>Type: {recipeType}</p>}
      <h3>Steps:</h3>
      {recipeSteps.length > 0 ? (
        <ol>
          {recipeSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      ) : (
        <p>No steps found for this recipe or loading.</p>
      )}
    </div>
  );
}

export default RecipeDetail;

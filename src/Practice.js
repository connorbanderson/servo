import React from "react";

const Practice = ({}) => {


  const createMatrix = (xLength, yLength) => {
    const matrix = [];
    for (let i = 0; i <= yLength; i++) {
      matrix.push([]);
      for (let j = 0; j <= xLength; j++) {
        matrix[i].push(0);
      }
    }
    return matrix;
  };

  const longestSubsequence = (x, y) => {
    const xLength = x.length;
    const yLength = y.length;
    const xArray = x.split("");
    const yArray = y.split("");
    const dp = createMatrix(xLength, xLength);
    // Doing the DP Algorithm filling in the Matrix
    for (let i = 1; i <= yLength; i++) {
      for (let j = 1; j <= xLength; j++) {
        if (x[j - 1] === y[i - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
        else dp[i][j] = dp[i][j - 1];
      }
    }
    // You can't just trust dp[yLength][xLength]
    let longest = 0;
    for (let i = 1; i <= yLength; i++) {
      longest = Math.max(longest, dp[i][xLength]);
    }
    return longest;
  };

  return <span>practice</span>;
};

export default Practice;

/*

function longestSubsequence(x, y) {
    const xLength = x.length
    const yLength = y.length
    const xArray = x.split('')
    const yArray = y.split('')
    const dp = (dims => {
        const allocate = dims => {
            if (dims.length === 0) return 0;
            else {
                let array = [];
                for (let i = 0; i < dims[0]; i++) {
                    array.push(allocate(dims.slice(1)));
                }
                return array;
            }
        };
        return allocate(dims);
        })([2000, 2000]);

    for (let i = 0; i <= yLength; i++) {
        for (let j = 0; j <= xLength ; j++) {
            dp[i][j] = 0
        }
    }

    for (let i = 1; i <= yLength; i++) {
        for (let j = 1; j <= xLength; j++) {
            if (
            (c => {
                return c.charCodeAt == null ? c : c.charCodeAt(0);
            })(x[j - 1]) ==
            (c => {
                return c.charCodeAt == null ? c : c.charCodeAt(0);
            })(y[i - 1])
            )
            dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = dp[i][j - 1];
        }
    }

    let longest = 0
    for (let i = 1; i <= yLength; i++) {
        longest = Math.max(longest, dp[i][xLength])
    }
    return longest
}


*/

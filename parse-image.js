import cv from '@techstark/opencv-js';

// DOM Elements
const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const outputCanvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
const outputCtx = outputCanvas.getContext('2d');

upload.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    detectSudokuGrid(imageData);
  };
});

async function detectSudokuGrid(imageData) {
  const src = cv.matFromImageData(imageData);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const blurred = new cv.Mat();
  cv.GaussianBlur(gray, blurred, new cv.Size(7, 7), 1, 1, cv.BORDER_DEFAULT);

  const edges = new cv.Mat();
  cv.Canny(blurred, edges, 30, 120);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  let largestContour = null;
  let largestArea = 0;

  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const area = cv.contourArea(contour);
    if (area > largestArea) {
      largestArea = area;
      largestContour = contour;
    }
  }

  const approx = new cv.Mat();
  const peri = cv.arcLength(largestContour, true);
  cv.approxPolyDP(largestContour, approx, 0.02 * peri, true);

  if (approx.rows !== 4) {
    console.error('Could not find a Sudoku grid!');
    drawContours(src, contours); // Debugging: Draw contours on the source image
    cleanup([src, gray, blurred, edges, contours, hierarchy, approx]);
    return;
  }

  const srcPoints = Array.from(approx.data32S).reduce((arr, val, idx) => {
    if (idx % 2 === 0) arr.push({ x: val, y: approx.data32S[idx + 1] });
    return arr;
  }, []);

  const dstPoints = [
    { x: 0, y: 0 },
    { x: 450, y: 0 },
    { x: 450, y: 450 },
    { x: 0, y: 450 },
  ];

  const srcMat = cv.matFromArray(4, 1, cv.CV_32FC2, srcPoints.flat());
  const dstMat = cv.matFromArray(4, 1, cv.CV_32FC2, dstPoints.flat());

  const M = cv.getPerspectiveTransform(srcMat, dstMat);
  const warped = new cv.Mat();
  cv.warpPerspective(gray, warped, M, new cv.Size(450, 450), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

  if (warped.cols > 0 && warped.rows > 0) {
    const displayMat = new cv.Mat();
    cv.cvtColor(warped, displayMat, cv.COLOR_GRAY2RGBA);

    const warpedImageData = new ImageData(new Uint8ClampedArray(displayMat.data), displayMat.cols, displayMat.rows);
    outputCanvas.width = displayMat.cols;
    outputCanvas.height = displayMat.rows;
    outputCtx.putImageData(warpedImageData, 0, 0);

    displayMat.delete();
  } else {
    console.error('Warped matrix is invalid or empty!');
  }

  cleanup([src, gray, blurred, edges, contours, hierarchy, largestContour, approx, M, warped]);
}

function drawContours(image, contours) {
  const contourImage = image.clone();
  cv.drawContours(contourImage, contours, -1, new cv.Scalar(255, 0, 0, 255), 2);
  const contourImageData = new ImageData(new Uint8ClampedArray(contourImage.data), contourImage.cols, contourImage.rows);
  outputCanvas.width = contourImage.cols;
  outputCanvas.height = contourImage.rows;
  outputCtx.putImageData(contourImageData, 0, 0);
  contourImage.delete();
}

function cleanup(mats) {
  mats.forEach((mat) => mat.delete());
}

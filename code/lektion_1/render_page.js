let t = "Simpel IWP Demo";
let h = "IWP Demo";
let d = "JS Script er koert";
console.log(renderPage(t, h, d));

function renderPage(title, heading, demoString) {
    return `<!DOCTYPE html>
<html lang="da">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
  </head>
  <body>
    <!-- page content -->
    <h1>${heading}</h1>
    <script>
      console.log("${demoString}");
    </script>
  </body>
</html>`;
}

/**
 * Export table to CSV file
 *
 * @param {Object} data
 */
export default function csvExport(data, to = "export") {
  /**
     * Data format
     * {
     *  title: String
     *  headers: Array<String>
     *  body: Array<Array<String>>
     * }
     */
  const { title, headers, body } = data;

  const universalBOM = "\uFEFF"; // Force UTF-8 encoding
  let csvContent = "";
  csvContent +=
    [
      headers.join(';'),
      ...body.map(line => line.join(';'))
    ].join('\n').replace(/(^\[)|(\]$)/gm, "");

  const link = document.createElement("a");
  link.setAttribute("href", `data:text/csv;charset=utf-8,${ encodeURIComponent(universalBOM + csvContent) }`);
  link.setAttribute("target", "__blank");
  link.setAttribute("download", `${to || title}.csv`);

  link.click();
}

$path = 'index.html'
if (Test-Path $path) {
    $content = Get-Content $path
    $content = $content -replace "const MAPBOX_TOKEN = '.*';", "window.MAPBOX_TOKEN = 'PROVIDE_MAPBOX_TOKEN';"
    $content = $content -replace "const WARNING_MESSAGE = .*", "window.WARNING_MESSAGE = 'Please Provide a Mapbox Token in order to use Kepler.gl. Edit this repository secret MAPBOX_TOKEN with your access key'"
    Set-Content -Path $path -Value $content
}

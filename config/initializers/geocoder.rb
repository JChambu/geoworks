Geocoder.configure(
  # Geocoding options
   timeout: 10,                 # geocoding service timeout (secs)
   #lookup: :bing,            # name of geocoding service (symbol)
  # lookup: :here,            # name of geocoding service (symbol)
  # language: :en,              # ISO-639 language code
  # use_https: true,           # use HTTPS for lookup requests? (if supported)
  # http_proxy: nil,            # HTTP proxy server (user:pass@host:port)
  # https_proxy: nil,           # HTTPS proxy server (user:pass@host:port)
  # api_key: [
   #api_key: "Av18IDKi-kL8knFM1xLrCeZo0QXrpfGgkg1DQdrCfK3optqWEBBc0Rb9MJRAcnFQ"
  #    "ZTVBhWvg8dw4GhrG9fcL",
  #    "jOEPEj4JkZvbAiv7GP0E2A",
  # ],                # API key for geocoding service
  # useCIT: true
 # cache: nil,                 # cache object (must respond to #[], #[]=, and #keys)
  # cache_prefix: 'geocoder:',  # prefix (string) to use for all cache keys

  # Exceptions that should not be rescued by default
  # (if you want to implement custom error handling);
  # supports SocketError and Timeout::Error
  # always_raise: [],

  # Calculation options
  # units: :mi,                 # :km for kilometers or :mi for miles
  # distances: :linear          # :spherical or :linear

# #HERE
#    lookup: :here,            # name of geocoding service (symbol)
#    use_https: true,           # use HTTPS for lookup requests? (if supported)
#    api_key: [
#       "ZTVBhWvg8dw4GhrG9fcL",
#       "jOEPEj4JkZvbAiv7GP0E2A",
#    ],                # API key for geocoding service
#    useCIT: true
   
=begin

#bing
   lookup: :bing,            # name of geocoding service (symbol)
   api_key: "Av18IDKi-kL8knFM1xLrCeZo0QXrpfGgkg1DQdrCfK3optqWEBBc0Rb9MJRAcnFQ"

=end
#google
   lookup: :google,
   api_key: "AIzaSyA0U3-pdBemLlkXGrFK0rVWZhVCL506kAE"
   #api_key: "AIzaSyCRcOWYZrmE-uw1k45zaOxM6Ew_--ntfbA"
   # api_key: "AIzaSyAZBimR8PR-OWDXb-BCPJkOMh9f0Z15fAw"
  #api_key: "AIzaSyDBgTkc_XNRYs4zZ_kOeTaa9ydmVERABcw" 
)

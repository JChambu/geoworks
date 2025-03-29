class DirectionsController < ApplicationController
  def calculate
    require 'net/http'
    require 'uri'
    require 'json'

    origin = params[:origin_place_id]
    destination = params[:destination_place_id]

    uri = URI("https://maps.googleapis.com/maps/api/directions/json")
    uri.query = URI.encode_www_form({
      origin: "place_id:#{origin}",
      destination: "place_id:#{destination}",
      key: "AIzaSyDSL6HQU_1zGVSINHHYLQ7pthPErHKqVDc",
      language: 'es',
      overview: "full",
      alternatives: true
    })

    response = Net::HTTP.get_response(uri)
    data = JSON.parse(response.body)

    if data["status"] == "OK"
      render json: {
        steps: data["routes"][0]["legs"][0]["steps"],
        distance: data["routes"][0]["legs"][0]["distance"]["text"],
        duration: data["routes"][0]["legs"][0]["duration"]["text"],
        origin: data["routes"][0]["legs"][0]["start_location"],
        destination: data["routes"][0]["legs"][0]["end_location"],
        travel_mode: data["routes"][0]["legs"][0]["steps"][0]["travel_mode"]
      }
    else
      render json: { error: 'No se pudo calcular la ruta' }, status: :unprocessable_entity
    end
  end
end

#set path to the application
app_dir= "/opt/geoworks"
shared_dir = "#{app_dir}/shared/tmp"
working_directory "#{app_dir}/current"

# Set unicorn options
worker_processes 2
preload_app true
timeout 30000000

# Path for the Unicorn socket
listen "#{shared_dir}/sockets/unicorn.sock", :backlog => 64

# Set path for logging
stderr_path "#{app_dir}/shared/log/unicorn.stderr.log"
stdout_path "#{app_dir}/shared/log/unicorn.stdout.log"

# Set proccess id path
pid "#{shared_dir}/pids/unicorn.pid"

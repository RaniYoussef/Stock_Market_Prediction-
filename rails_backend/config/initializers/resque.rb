require 'resque-scheduler'
require 'resque/scheduler/server'

if defined?(Resque) && File.exist?(Rails.root.join('config/resque_schedule.yml'))
  Resque.schedule = YAML.load_file(Rails.root.join('config/resque_schedule.yml'))
end

$env = $args[0]
$cmd = $args | Select-Object -Skip 1
docker-compose -f docker-compose.$env.yml $

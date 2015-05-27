printer(){
  printf '\n' && printf '=%.0s' {1..40} && printf '\n'
  echo $1
  printf '=%.0s' {1..40} && printf '\n'
}

printer "Deploying dashbeat web app ..."

printer "Installing node modules ..."
npm install

printer "Installing bower components ..."
bower install

printer "Running gulp tasks ..."
gulp
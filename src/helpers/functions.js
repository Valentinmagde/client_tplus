


export const handleError = (error) => {
	window.console.log(error)
	let errors = error.response.data.errNo
  let msg = error.response.data.errMsg
  let erreur = []

	if(errors==10)
    Object.keys(msg).forEach(function(key) {
      erreur = msg[key]['0']
    })
  else
    erreur = msg

  return erreur
}




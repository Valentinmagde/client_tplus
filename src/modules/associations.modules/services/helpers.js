export function extractMember(user, members){

  var membre
  members.forEach(member => {
    member.users.forEach(author => {
      if(user.id == author.id) {
        membre = member
        }
      })
  })
    return membre
}

const colors = [
  '#28C76F',
  '#FF9F43',
  '#1890ff',
]

export function randomBackground(index){
if(index >= colors.length)
  return colors[Math.floor(Math.random() * colors.length)]
else
  return colors[index]
}
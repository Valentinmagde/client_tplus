import Vue from 'vue'
import i18n from '../i18n/i18n'

Vue.filter('Capitalize', function (value) {
	if (!value) return ''
	value = value.toString()
	let arr = value.split(" ")
	let capitalized_array = []
	arr.forEach((word) => {
		let capitalized = word.charAt(0).toUpperCase() + word.slice(1)
		capitalized_array.push(capitalized)
	})
	return capitalized_array.join(" ");
})

Vue.filter('CAPITALIZE', function (value) {
  if(!value) return ''
	return value.toUpperCase()
})

Vue.filter('small', function (value) {
  if(!value) return ''
	return value.toLowerCase()
})

Vue.filter('title', function (value, replacer="_") {
  if (!value) return ''
  value = value.toString()

  let arr = value.split(replacer)
  let capitalized_array = []
  arr.forEach((word) => {
    let capitalized = word.charAt(0).toUpperCase() + word.slice(1)
    capitalized_array.push(capitalized)
  })
  return capitalized_array.join(" ");
})

Vue.filter('truncate', function(value, limit = 64) {
  const parsed = value instanceof String ? value : value.toString();
	if (value.length <= limit) return parsed;
  return parsed.substring(0, limit) + "...";
})

Vue.filter('tailing', function(value, tail) {
	return value + tail;
})

Vue.filter('time', function(value, is24HrFormat = false) {
	if(value) {
		const date = new Date(Date.parse(value));
		let hours = date.getHours();
		const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
		if(!is24HrFormat) {
			const time = hours > 12 ? 'AM' : 'PM';
			hours = hours % 12 || 12;
			return hours + ':' + min + ' ' + time
		}
		return hours + ':' + min
	}
})

Vue.filter('date', function(value, fullDate = false) {
	value = String(value)
	const date = value.slice(8,10).trim();
	const month = value.slice(4,7).trim();
	const year = value.slice(11,15);

	if(!fullDate) return date + ' ' + month;
	else return date + ' ' + month + ' ' + year;
})

Vue.filter('dateTime', function(value) {

  const locale = i18n.locale;
  const options = { month: "long", day: "numeric", year: "numeric" };

  if(!value || isNaN(value)) return ''
  return new Date(value*1000).toLocaleString(locale, options);
})

Vue.filter('fullDateTime', function(value) {

  const locale = i18n.locale;
  const options = {month: "long", day: "numeric", year: "numeric", hour:'numeric', minute: 'numeric'};

  if(!value || isNaN(value)) return ''
  return new Date(value*1000).toLocaleString(locale, options )
})

Vue.filter('month', function(val, showYear = true) {
  val = String(val)

  const regx = /\w+\s(\w+)\s\d+\s(\d+)./;
  if(!showYear) {
    return regx.exec(val)[1];
  }else {
    return regx.exec(val)[1] + ' ' + regx.exec(val)[2];
  }

})

Vue.filter('csv', function(value) {
  if(!value) return ''
	return value.join(', ')
})

Vue.filter('filter_tags', function(value) {
  if(!value) return ''
	return value.replace(/<\/?[^>]+(>|$)/g, "")
})

Vue.filter('k_formatter', function(num) {
  if(!num || isNaN(num)) return ''
	return num > 999 ? (num/1000).toFixed(1) + 'k' : num
})

Vue.filter('formatMoney', function(number, devise) {
  if(number == null || isNaN(number))
  number = 0

  return number.toLocaleString('en-US', { style: 'currency', currency: devise, minimumFractionDigits: 2 });
})

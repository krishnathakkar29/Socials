import moment from 'moment'


const convertDate = (time) => {
    return moment(time).fromNow()
}

export {convertDate}
import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const PostData = (url, body) =>{
    return request({
        url: url,
        method: 'post',
        data: body
    })
};

export const GetData = (url) =>{
    return request({
        url: url,
        method: 'get'
    })
}

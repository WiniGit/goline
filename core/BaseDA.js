const ERROR_AUTHEN = "401";
const NO_ROLE = "403";
const MULTI_DEVICE = "423";

class BaseDA {
    static postData = async (url, { headers, bodyData }) => {
        let output;
        try {
            await $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(bodyData),
                headers: headers != null && headers != undefined ? headers : base_headers(),
                success: function (data) {
                    if (data.Code === 200) {
                        output = data;
                    } else {
                        output = null;
                        toastr["error"](data.Message);
                    }
                },
                error: function (xhr, status, error) {
                    // Handle error cases here
                    output = null;
                }
            });
        } catch (error) {
            console.error("Failed to POST data:", error);
            throw error;
        }
        return output
    }
    static getData = async (url, { headers }) => {
        let output;
        try {
            await $.ajax({
                url: url,
                type: 'POST',
                headers: headers != null && headers != undefined ? headers : base_headers(),
                success: function (data) {
                    if (data.Code === 200) {
                        output = data;
                    } else {
                        output = null;
                        toastr["error"](data.Message);
                    }
                },
                error: function (xhr, status, error) {
                    // Handle error cases here
                    output = null;
                }
            });
        } catch (error) {
            console.error("Failed to POST data:", error);
            throw error;
        }
        return output
    }

}
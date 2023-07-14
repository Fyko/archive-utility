use crate::error::DisplayError;
use futures_util::TryStreamExt;
use worker::*;

pub fn register(router: Router<()>) -> Router<()> {
    router.get_async("/display", |req, _ctx| async move {
        let url = req.url()?;
        let uri = url.query_pairs().find(|(key, _)| key == "uri");
        if uri.is_none() {
            return Response::error("Missing query param `uri`", 400);
        }

        let re = regex::Regex::new(
            r"https?:\/\/cdn\.discordapp\.com\/attachments\/\d{17,19}\/\d{17,19}\/.*?.(?:html)",
        )
        .unwrap();

        let uri = uri.unwrap().1;
        if !re.is_match(&uri) {
            return Response::error("Invalid query param `uri`", 400);
        }

        let res = match reqwest::get(uri.to_string()).await {
            Ok(resp) => resp,
            Err(_) => return Response::error("Failed to fetch `uri`", 500),
        };

        let stream = res.bytes_stream().map_err(DisplayError::Reqwest);

        let headers = Headers::from_iter(vec![("Content-Type", "text/html")].iter());
        let response = Response::from_stream(stream)?.with_headers(headers);

        Ok(response)
    })
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_discord_cdn_regex() {
        let re = regex::Regex::new(
            r"https?:\/\/cdn\.discordapp\.com\/attachments\/\d{17,19}\/\d{17,19}\/.*?.(?:html)",
        )
        .unwrap();
        // Test a valid Discord CDN URL
        let valid_url = "https://cdn.discordapp.com/attachments/123456789012345678/123456789012345678/something.html";
        assert!(re.is_match(valid_url));

        // Test an invalid URL
        let invalid_url = "https://not.discord.com/attachments/123456789012345678/123456789012345678/something.html";
        assert!(!re.is_match(invalid_url));
    }
}

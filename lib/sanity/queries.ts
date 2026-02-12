import { groq } from 'next-sanity';

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    seo {
      metaTitle,
      metaDescription,
      ogImage,
      noIndex
    },
    components[] {
      _type,
      _key,
      _type == "titleBanner" => {
        headline,
        subheader,
        fullHeight,
        backgroundImage,
        backgroundColor,
        button
      },
      _type == "contentBanner" => {
        headline,
        subheader,
        backgroundImage,
        backgroundColor,
        overlay,
        position,
        button
      },
      _type == "productCardHero" => {
        headline,
        subheading,
        variant,
        cards[] {
          product-> {
            _id,
            title,
            slug,
            shortDescription,
            pricing
          },
          title,
          description,
          category,
          badge,
          thumbnail
        },
        background {
          type,
          color,
          image,
          "video": video.asset-> { url },
          poster
        }
      },
      _type == "comparisonTable" => {
        title,
        columns,
        rows,
        footnotes
      },
      _type == "diptychMediaTitle" => {
        imageUrl,
        mainHeading,
        leftColumnTitle,
        leftColumnContent,
        rightColumnTitle,
        rightColumnContent,
        imagePosition,
        backgroundColor
      },
      _type == "safetyStandards" => {
        title,
        description,
        standards,
        ctaButton
      },
      _type == "listicle" => {
        banner {
          headline,
          subheader,
          backgroundImage,
          backgroundColor,
          overlay,
          position,
          button
        },
        listItems[] {
          headline,
          description,
          featuredImage,
          button,
          reverse
        }
      },
      _type == "usp2" => {
        headline,
        cards,
        productCards[] {
          headline,
          bodyCopy,
          featuredImage
        }
      },
      _type == "ctaBanner" => {
        headline,
        button,
        backgroundColor,
        textColor
      },
      _type == "pressTestimonials" => {
        testimonials[] {
          quote,
          source,
          publication
        }
      },
      _type == "awardSlideshow" => {
        eyebrowText,
        autoPlayInterval,
        awards[] {
          heroText,
          subText,
          backgroundImage
        },
        awardIcons
      },
      _type == "socialPosts" => {
        title,
        subtitle,
        backgroundColor,
        posts[] {
          username,
          image
        }
      },
      _type == "diaperIssueBreakdown" => {
        title,
        subtitle,
        issues[] {
          issue,
          parentThought,
          actualCause,
          howCoterieHelps
        }
      },
      _type == "diaperMythReality" => {
        title,
        subtitle,
        items[] {
          myth,
          reality,
          explanation
        }
      },
      _type == "diaperProblemSolver" => {
        title,
        subtitle,
        problems[] {
          problem,
          symptom,
          rootCause,
          solution
        }
      },
      _type == "quote" => {
        quote
      },
      _type == "simplePdpHero" => {
        image,
        title,
        description,
        price,
        rating,
        reviewCount
      },
      _type == "announcementBar" => {
        announcement
      },
      _type == "quiz" => {
        title,
        questions[] {
          question,
          options[] {
            label,
            value
          }
        }
      },
      _type == "productCrossSell" => {
        headline,
        "products": products[]-> {
          _id,
          title,
          slug,
          shortDescription,
          category,
          thumbnail,
          pricing
        }
      },
      _type == "ugcVideo" => {
        videoUrl,
        posterImage
      },
      _type == "flexAnnouncementBar" => {
        announcement,
        showStars,
        rating
      },
      _type == "pressStatements" => {
        statements[] {
          outlet,
          logo,
          quote,
          showStars,
          starText
        }
      },
      _type == "testimonialGrid" => {
        eyebrow,
        headline,
        testimonials[] {
          body,
          authorName,
          authorHandle,
          authorImage
        }
      },
      _type == "simpleStats" => {
        stats[] {
          value,
          name
        }
      },
      _type == "steppedStats" => {
        headline,
        description,
        stats[] {
          value,
          title,
          description,
          color
        }
      },
      _type == "pdpHeroV2" => {
        "product": product-> {
          _id,
          title,
          images[] {
            image,
            alt
          },
          sizes[] {
            sizeKey,
            featuredImage
          },
          orderTypes {
            autoRenew {
              badgeText,
              title,
              benefits
            },
            oneTimePurchase {
              title,
              benefits
            }
          }
        },
        rating,
        reviewCount
      },
      _type == "threeColumnTable" => {
        headline,
        sidebarLabels,
        tabs[] {
          title,
          buttonText,
          col2Header,
          col3Header,
          rows[] {
            label,
            col2,
            col3
          }
        }
      }
    }
  }
`;

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)].slug.current
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    desktopRedirect {
      enabled,
      destinationUrl,
      requireUtmParams
    }
  }
`;

export const funnelRulesQuery = groq`
  *[_type == "funnel" && enabled == true]{
    sourcePath,
    "targetSlug": landingPage->slug.current,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    routes[]{ _key, name, weight, destinationType, "targetSlug": landingPage->slug.current, targetUrl }
  }
`;
